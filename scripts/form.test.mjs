import assert from 'node:assert/strict';
import test from 'node:test';
import { initialFormValues, isFormValueEmpty, validateFormValues } from '../components/ui/kalos-form-state.ts';

const fields = [
  { name: 'email', label: '邮箱地址', type: 'email', required: true },
  { name: 'password', label: '密码', type: 'password', required: true, minLength: 8 },
  { name: 'role', label: '成员角色', type: 'select', required: true, items: [{ value: 'editor', label: '编辑者' }] },
  { name: 'notifications', label: '消息通知', type: 'switch' },
  { name: 'terms', label: '同意服务条款', type: 'checkbox', required: true },
];
const valid = { email: 'test@example.com', password: 'demo1234', role: 'editor', notifications: false, terms: true };

test('initial values preserve false and empty strings and ignore unrelated defaults', () => {
  assert.deepEqual(initialFormValues(fields, { notifications: true, terms: false, unrelated: 'ignored' }), { email: '', password: '', role: '', notifications: true, terms: false });
});
test('empty required fields produce field errors while optional switches stay valid', () => {
  assert.deepEqual(Object.keys(validateFormValues(fields, initialFormValues(fields))), ['email', 'password', 'role', 'terms']);
});
test('email format, password length, and select membership validate independently', () => {
  assert.deepEqual(validateFormValues(fields, valid), {});
  const errors = validateFormValues(fields, { ...valid, email: 'test@', password: 'short', role: 'unknown' });
  assert.equal(errors.email, '请输入有效的邮箱地址');
  assert.equal(errors.password, '密码至少需要 8 位');
  assert.equal(errors.role, '请选择有效的选项');
});
test('password characters are preserved while whitespace-only text is required', () => {
  assert.deepEqual(validateFormValues(fields, { ...valid, password: '        ' }), {});
  assert.equal(validateFormValues([{ name: 'name', label: '名称', type: 'text', required: true }], { name: '   ' }).name, '请输入名称');
});
test('disabled fields skip built-in validation and required switches need true', () => {
  assert.deepEqual(validateFormValues(fields.map(field => ({ ...field, disabled: true })), {}), {});
  assert.equal(validateFormValues([{ name: 'enabled', label: '验证', type: 'switch', required: true }], { enabled: false }).enabled, '请开启验证');
});

test('clear detection treats empty text and unchecked toggles as empty without trimming passwords', () => {
  assert.equal(isFormValueEmpty(fields[0], 'test@example.com'), false);
  assert.equal(isFormValueEmpty(fields[0], ''), true);
  assert.equal(isFormValueEmpty(fields[0], '  '), true);
  assert.equal(isFormValueEmpty(fields[1], '  '), false);
  assert.equal(isFormValueEmpty(fields[1], ''), true);
  assert.equal(isFormValueEmpty(fields[4], false), true);
  assert.equal(isFormValueEmpty(fields[4], true), false);
});
