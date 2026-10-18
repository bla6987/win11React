import test from 'node:test';
import assert from 'node:assert/strict';
import reducer, { createFileState } from '../src/reducers/files.js';
import { Item } from '../src/utils/bin.js';
const docs = state => state.data.getId(state.data.special['%documents%']);
const bin = state => state.data.getId(state.data.special['%recyclebin%']);
const file = state => docs(state).data.find(item => item.type === 'file');

test('deleting a file moves it into the bin with origin metadata, without changing old Redux state', () => {
  const before = createFileState(), item = file(before);
  const after = reducer(before, { type: 'FILERECYCLE', payload: item.id });
  assert.equal(bin(before).data.length, 0);
  assert.ok(docs(before).data.includes(item));
  assert.equal(bin(after).data[0].id, item.id);
  assert.equal(bin(after).data[0].recycled.location, 'C:\\Users\\owner\\Documents');
  assert.equal(after.data.parsePath('C:\\Users\\owner\\Documents\\Practice notes.txt'), null);
});

test('restore preserves file ID, data, and original folder', () => {
  let state = createFileState(); const original = file(state);
  state = reducer(state, { type: 'FILERECYCLE', payload: original.id });
  state = reducer(state, { type: 'FILERESTORE', payload: original.id });
  assert.equal(bin(state).data.length, 0);
  assert.equal(file(state).id, original.id);
  assert.equal(file(state).data, original.data);
  assert.equal(file(state).host.id, docs(state).id);
  assert.equal(file(state).recycled, undefined);
});

test('recycled folders preserve descendants and cannot be entered until restored', () => {
  let state = createFileState(); const folder = docs(state).data.find(item => item.type === 'folder');
  const child = folder.data[0];
  state = reducer(state, { type: 'FILERECYCLE', payload: folder.id });
  assert.equal(reducer(state, { type: 'FILEDIR', payload: folder.id }), state);
  state = reducer(state, { type: 'FILERESTORE', payload: folder.id });
  assert.equal(state.data.getId(child.id).host.id, folder.id);
  assert.ok(docs(state).data.some(item => item.id === folder.id));
});

test('protected folders, invalid IDs, and already recycled items cannot be recycled', () => {
  let state = createFileState();
  for (const id of [docs(state).id, state.data.special['%user%'], 'not-a-file']) {
    state = reducer(state, { type: 'FILERECYCLE', payload: id });
    assert.equal(bin(state).data.length, 0);
  }
  const id = file(state).id;
  state = reducer(state, { type: 'FILERECYCLE', payload: id });
  state = reducer(state, { type: 'FILERECYCLE', payload: id });
  assert.equal(bin(state).data.length, 1);
});

test('purging removes the whole subtree and leaves previous state intact', () => {
  let state = createFileState(); const folder = docs(state).data.find(item => item.type === 'folder');
  const childId = folder.data[0].id;
  state = reducer(state, { type: 'FILERECYCLE', payload: folder.id });
  const previous = state;
  state = reducer(state, { type: 'FILEPURGE', payload: folder.id });
  assert.equal(state.data.getId(folder.id), undefined);
  assert.equal(state.data.getId(childId), undefined);
  assert.equal(bin(previous).data.length, 1);
  assert.ok(previous.data.getId(childId));
});

test('emptying removes all recycled items but does not remove live files', () => {
  let state = createFileState(); const id = file(state).id;
  state = reducer(state, { type: 'FILERECYCLE', payload: id });
  const liveFolderId = docs(state).data[0].id;
  state = reducer(state, { type: 'FILEEMPTYBIN' });
  assert.equal(bin(state).data.length, 0);
  assert.ok(state.data.getId(liveFolderId));
  assert.equal(state.data.getId(id), undefined);
});

test('restore resolves name collisions without overwriting existing files', () => {
  const data = createFileState().data;
  const folder = data.getId(data.special['%documents%']), original = folder.data[0];
  data.recycle(original.id);
  const newer = new Item({ type: 'file', name: original.name, data: 'Keep me', host: folder });
  folder.data.push(newer); data.setId(newer.id, newer);
  data.restore(original.id);
  assert.equal(original.name, 'Practice notes (restored 1).txt');
  assert.equal(newer.data, 'Keep me');
});

test('restore falls back to Documents when the original parent is deleted', () => {
  const data = createFileState().data;
  const parent = data.getId(data.special['%documents%']).data.find(item => item.type === 'folder');
  const child = parent.data[0];
  data.recycle(child.id); data.recycle(parent.id); data.purge(parent.id);
  assert.ok(data.restore(child.id));
  assert.equal(child.host.id, data.special['%documents%']);
});

test('navigation history removes purged and recycled folders and resets stale selections', () => {
  let state = createFileState(); const folder = docs(state).data.find(item => item.type === 'folder');
  state = reducer(state, { type: 'FILEDIR', payload: folder.id });
  const previous = state;
  state = reducer(state, { type: 'FILERECYCLE', payload: folder.id });
  assert.equal(state.cdir, docs(state).id);
  assert.ok(!state.hist.includes(folder.id));
  assert.ok(previous.hist.includes(folder.id));
  state = reducer(state, { type: 'RECYCLEBIN' });
  assert.equal(state.cdir, bin(state).id);
  state = reducer(state, { type: 'FILESELECT', payload: folder.id });
  state = reducer(state, { type: 'FILEEMPTYBIN' });
  assert.equal(state.selected, null);
  assert.equal(state.cdir, bin(state).id);
});

test('normal folders cannot be permanently deleted by a purge action', () => {
  let state = createFileState(); const id = file(state).id;
  state = reducer(state, { type: 'FILEPURGE', payload: id });
  assert.ok(state.data.getId(id));
  assert.equal(bin(state).data.length, 0);
});

test('fresh sessions have independent filesystem trees', () => {
  const first = createFileState(), second = createFileState();
  first.data.recycle(file(first).id);
  assert.equal(bin(second).data.length, 0);
});

test('desktop shortcuts can be recycled and restored; the bin itself is protected', () => {
  let state = createFileState();
  const shortcut = { name: 'Calculator', icon: 'calculator', type: 'app', action: 'CALCUAPP' };
  state = reducer(state, { type: 'DESKRECYCLE', payload: shortcut });
  const entry = bin(state).data[0];
  assert.equal(entry.name, 'Calculator.lnk');
  assert.equal(entry.recycled.location, 'C:\\Users\\owner\\Desktop');
  assert.equal(entry.data.action, shortcut.action);
  state = reducer(state, { type: 'FILERESTORE', payload: entry.id });
  assert.equal(bin(state).data.length, 0);
  assert.equal(state.data.getId(entry.id).host.id, state.data.special['%desktop%']);
  state = reducer(state, { type: 'DESKRECYCLE', payload: { name: 'Recycle Bin' } });
  assert.equal(bin(state).data.length, 0);
});
