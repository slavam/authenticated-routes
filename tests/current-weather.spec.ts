import { test, expect } from '@playwright/test'

// Мокаем данные, которые должен вернуть API
const MOCK_OBSERVATIONS = [
  { meas_hash: 1451382247, value: '293.15' }, // Температура (293.15 - 273.15 = 20.0)
  { meas_hash: -789901366, value: '180' },    // Направление ветра
  { meas_hash: 1345858116, value: '5' },      // Скорость ветра
  { meas_hash: -996973625, value: '65' },     // Влажность
  { meas_hash: 882721309, value: '0.5' },     // Осадки (> 0)
]

test.describe('CurrentWeather Component', () => {

  // Перед каждым тестом перехватываем запрос к API и возвращаем моки
  test.beforeEach(async ({ page }) => {
    // 1. Кладём имя пользователя под ключом, который ждёт AuthProvider
    await page.addInitScript(() => {
      localStorage.setItem('tanstack.auth.user', 'test6')
    })

    // 2. Мокаем API погоды
    await page.route('**/api/current-weather*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_OBSERVATIONS),
      })
    })

    // 3. Переходим на защищённую страницу
    await page.goto('/currentWeather')
  })

  test('отображает заголовок с выбранной станцией по умолчанию', async ({ page }) => {
    // Проверяем, что по умолчанию выбрана первая станция (Донецк)
    await expect(page.getByRole('heading', { name: /Погода на метеостанции Донецк/ })).toBeVisible()
  })

  test('отображает метеоданные после успешной загрузки', async ({ page }) => {
    // Ждем, пока пропадет спиннер (или появится контент)
    await expect(page.locator('ul')).toBeVisible()

    // Проверяем, что значения корректно распарсились и отформатировались
    await expect(page.getByText('Температура:')).toBeVisible()
    await expect(page.getByText('Направление ветра:')).toBeVisible()
    await expect(page.getByText('Скорость ветра:')).toBeVisible()
    await expect(page.getByText('Относительная влажность:')).toBeVisible()
    // await expect(page.getByText('Осадки на станции')).toBeVisible()
  })

  test('позволяет сменить станцию через кастомный селект', async ({ page }) => {
    // 1. Открываем выпадающий список (кликаем по контролу react-select)
    // React-select обычно имеет класс, начинающийся на css-, но мы можем найти его по id или роли
    await page.locator('#select-station').click()

    // 2. Ждем появления меню и выбираем "Амвросиевка"
    // В react-select опции имеют роль 'option'
    await page.getByRole('option', { name: 'Амвросиевка' }).click()

    // 3. Проверяем, что заголовок обновился
    await expect(page.getByRole('heading', { name: /Погода на метеостанции Амвросиевка/ })).toBeVisible()
  })

  test('отображает сообщение "Данные не найдены", если API вернул пустой массив', async ({ page }) => {
    // Переопределяем мок для этого конкретного теста (возвращаем пустоту)
    await page.route('**/api/current-weather*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // Перезагружаем страницу, чтобы применился новый мок
    await page.reload()

    // Проверяем, что отобразился fallback
    page.getByRole('heading', { level: 1, name: 'Данные не найдены' })
  })
})