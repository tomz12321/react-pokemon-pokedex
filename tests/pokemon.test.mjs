import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchPokemon, selectPokemonByName, selectRequestByName } from '../src/reducers/pokemon.js';

const makeStore = () => configureStore({ reducer: { pokemon: reducer } });
const pikachu = { id: 25, name: 'pikachu' };
const bulbasaur = { id: 1, name: 'bulbasaur' };
const response = (data) => new Response(JSON.stringify(data), { status: 200 });
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

test('normalizes queries and reuses the cache for both name and number', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => response(pikachu));
  const store = makeStore();
  await store.dispatch(fetchPokemon('  PIKACHU  '));
  await store.dispatch(fetchPokemon('pikachu'));
  await store.dispatch(fetchPokemon('25'));

  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(fetch.mock.calls[0].arguments[0], 'https://pokeapi.co/api/v2/pokemon/pikachu');
  assert.deepEqual(selectPokemonByName(' PIKACHU ')(store.getState()), pikachu);
  assert.deepEqual(selectPokemonByName('25')(store.getState()), pikachu);
});

test('duplicate in-flight requests share one fetch without replacing the loading state', async (t) => {
  const pending = deferred();
  const fetch = t.mock.method(globalThis, 'fetch', () => pending.promise);
  const store = makeStore();
  const first = store.dispatch(fetchPokemon('pikachu'));
  await store.dispatch(fetchPokemon(' PIKACHU '));
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(selectRequestByName('pikachu')(store.getState()).status, 'loading');
  pending.resolve(response(pikachu));
  await first;
  assert.equal(selectRequestByName('pikachu')(store.getState()).status, 'succeeded');
});

for (const [kind, reply] of [
  ['not-found', () => new Response('', { status: 404 })],
  ['server', () => new Response('', { status: 503 })],
  ['network', () => { throw new TypeError('Failed to fetch'); }],
  ['server', () => new Response('invalid JSON')],
  ['server', () => response({ unexpected: true })]
]) {
  test(`classifies ${kind} failures and supports an explicit retry (${reply.toString()})`, async (t) => {
    const fetch = t.mock.method(globalThis, 'fetch', reply);
    const store = makeStore();
    await store.dispatch(fetchPokemon('pikachu'));
    assert.equal(selectRequestByName('pikachu')(store.getState()).error.kind, kind);
    assert.equal(selectRequestByName('pikachu')(store.getState()).status, 'failed');
    assert.equal(fetch.mock.callCount(), 1);

    fetch.mock.mockImplementation(async () => response(pikachu));
    const retry = store.dispatch(fetchPokemon('pikachu'));
    assert.equal(selectRequestByName('pikachu')(store.getState()).error, null);
    await retry;
    assert.deepEqual(selectPokemonByName('pikachu')(store.getState()), pikachu);
    assert.equal(fetch.mock.callCount(), 2);
  });
}

test('slow older requests cannot replace another Pokémon’s data or error state', async (t) => {
  const slow = deferred();
  t.mock.method(globalThis, 'fetch', (url) => url.endsWith('/pikachu') ? slow.promise : response(bulbasaur));
  const store = makeStore();
  const older = store.dispatch(fetchPokemon('pikachu'));
  await store.dispatch(fetchPokemon('bulbasaur'));
  slow.resolve(new Response('', { status: 404 }));
  await older;
  assert.deepEqual(selectPokemonByName('bulbasaur')(store.getState()), bulbasaur);
  assert.equal(selectRequestByName('bulbasaur')(store.getState()).status, 'succeeded');
  assert.equal(selectRequestByName('pikachu')(store.getState()).error.kind, 'not-found');
});

test('times out stalled requests and releases the loading state', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(globalThis, 'fetch', (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const store = makeStore();
  const pending = store.dispatch(fetchPokemon('pikachu'));
  t.mock.timers.tick(15000);
  await pending;
  assert.equal(selectRequestByName('pikachu')(store.getState()).status, 'failed');
  assert.equal(selectRequestByName('pikachu')(store.getState()).error.kind, 'timeout');
});

test('aborted requests can be retried without reporting a lookup failure', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const store = makeStore();
  const pending = store.dispatch(fetchPokemon('pikachu'));
  pending.abort();
  await pending;
  assert.equal(selectRequestByName('pikachu')(store.getState()).status, 'idle');
  assert.equal(selectRequestByName('pikachu')(store.getState()).error, null);
  fetch.mock.mockImplementation(async () => response(pikachu));
  await store.dispatch(fetchPokemon('pikachu'));
  assert.deepEqual(selectPokemonByName('pikachu')(store.getState()), pikachu);
});

test('empty queries do not fetch and arbitrary names are not mistaken for cached properties', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 404 }));
  const store = makeStore();
  await store.dispatch(fetchPokemon('   '));
  assert.equal(fetch.mock.callCount(), 0);
  for (const name of ['constructor', '__proto__', 'a/b?c']) {
    assert.equal(selectPokemonByName(name)(store.getState()), undefined);
    await store.dispatch(fetchPokemon(name));
    assert.equal(selectRequestByName(name)(store.getState()).error.kind, 'not-found');
  }
  assert.equal(fetch.mock.calls[2].arguments[0], 'https://pokeapi.co/api/v2/pokemon/a%2Fb%3Fc');
});
