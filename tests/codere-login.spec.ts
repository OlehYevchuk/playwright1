import { test, expect } from '@playwright/test';

// it's better to move all sensitive data out of the code, e.g. to secret manager
const username = 'testproes2405';
const pass = 'Vale2015';

test.describe('Codere login', () => {

test.beforeEach(async ({ page }) => {
  // open the web-site page
  await page.goto('https://m.apuestas.codere.es/');
  // expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Las mejores Apuestas en Vivo de toda España | Codere®/);
  // accept the cookies
  await page.getByRole('button', { name: 'ACEPTAR' }).click();
});

test('check login form', async ({ page }) => {
  // check the start login button
  await expect(page.getByRole('button', { name: 'Acceder' })).toBeVisible();
  await page.getByRole('button', { name: 'Acceder' }).click();
  // check that username field is visible and editable
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeEditable();
  // check that password field is visible and editable
  await expect(page.getByLabel('Contraseña')).toBeVisible();
  await expect(page.getByLabel('Contraseña')).toBeEditable();
  // check that password field is changing status while clicking on show icon
  await expect(page.getByLabel('Contraseña')).toHaveAttribute('type', 'password');
  await page.getByLabel('eye', { exact: true }).click();
  await expect(page.getByLabel('Contraseña')).toHaveAttribute('type', 'text');
  await page.getByLabel('eye off').click();
  await expect(page.getByLabel('Contraseña')).toHaveAttribute('type', 'password');
  // check the end login button
  await expect(page.locator('#btnaccess')).toBeVisible();
  // check the close button
  await expect(page.getByRole('button', { name: 'close' })).toBeVisible();
  await page.getByRole('button', { name: 'close' }).click();
});

test('successful login', async ({ page }) => {
  // open login form
  await page.getByRole('button', { name: 'Acceder' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill(username);
  await page.getByLabel('Contraseña').click();
  await page.getByLabel('Contraseña').fill(pass);
  await page.locator('#btnaccess').click();
  // check that you has been logged in as testing user
  await expect(page.getByRole('button', { name: 'testproes2405' })).toBeVisible();
});

test('failed login - incorrect credentials', async ({ page }) => {
  // open login form
  await page.getByRole('button', { name: 'Acceder' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill('fake1234');
  await page.getByLabel('Contraseña').click();
  await page.getByLabel('Contraseña').fill('fake1234');
  await page.locator('#btnaccess').click();
  // check that you receive an appropriate error
  await expect(page.getByRole('heading', { name: 'Error de inicio de sesión' })).toBeVisible();
  await expect(page.getByText('Por favor, revisa los datos y vuelve a intentarlo. Ten en cuenta el uso de mayús')).toBeVisible();
  await expect(page.getByRole('button', { name: '¿Olvidó su contraseña?' })).toBeVisible();
});

test('failed login - password changes required', async ({ page }) => {
  // open login form
  await page.getByRole('button', { name: 'Acceder' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill('fake');
  await page.getByLabel('Contraseña').click();
  await page.getByLabel('Contraseña').fill('fake');
  await page.locator('#btnaccess').click();
  // check that you receive an error
  await expect(page.getByRole('heading', { name: 'Cambiar contraseña' }).locator('div')).toBeVisible();
  await expect(page.getByText('Por razones de seguridad por favor, cambia tu contraseña para poder acceder.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cambiar contraseña' })).toBeVisible();;
});

test('check the forgot/reset credentials option ', async ({ page }) => {
  // open login form
  await page.getByRole('button', { name: 'Acceder' }).click();
  // change password flow
  await page.getByRole('button', { name: '¿Olvidaste tu contraseña?' }).click();
  await page.getByText('Recordar contraseña').click();
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Usuario / Correo electrónico' })).toBeEditable();
  await expect(page.getByLabel('Introduce el resultado')).toBeVisible();
  await expect(page.getByLabel('Introduce el resultado')).toBeEditable();
  await expect(page.getByText('¿Cuánto es?')).toBeVisible();
  await page.getByRole('button', { name: 'Volver' }).click();
});
});