import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'
import { ROOT_NAME } from './api'
import App from './App'

jest.mock('./directory-structure.json', () => ({
  type: 'dir',
  children: {
    folder: {
      type: 'dir',
      children: {
        'filea.txt': {
          type: 'file',
        },
        subFolder: {
          type: 'dir',
          children: {
            'fileb.txt': {
              type: 'file',
            },
          },
        },
      },
    },
  },
}))

async function waitForLoading() {
  return waitForElementToBeRemoved(() => screen.getByText(/loading/i))
}

test('renders expected breadcrumbs and page contents while navigating to and from directories & files', async () => {
  const { getByRole, getByText } = render(<App />)

  const mainEl = getByRole('main')
  const breadcrumbsEl = getByRole('navigation', { name: 'breadcrumb' })

  // Initial state
  expect(mainEl).toHaveTextContent(/loading/i)

  await waitForLoading()

  // Root directory
  expect(breadcrumbsEl).toContainElement(getByText(ROOT_NAME))
  expect(mainEl).toContainElement(getByText('folder'))

  fireEvent.click(getByText('folder'))
  await waitForLoading()

  // 'folder' directory
  expect(breadcrumbsEl).toContainElement(getByText(ROOT_NAME))
  expect(breadcrumbsEl).toContainElement(getByText('folder'))
  expect(mainEl).toContainElement(getByText('filea.txt'))
  expect(mainEl).toContainElement(getByText('subFolder'))

  fireEvent.click(getByText('subFolder'))
  await waitForLoading()

  // 'subFolder' directory
  expect(breadcrumbsEl).toContainElement(getByText(ROOT_NAME))
  expect(breadcrumbsEl).toContainElement(getByText('folder'))
  expect(breadcrumbsEl).toContainElement(getByText('subFolder'))
  expect(mainEl).toContainElement(getByText('fileb.txt'))

  fireEvent.click(getByText('fileb.txt'))
  await waitForLoading()

  // 'fileb.txt' file
  expect(breadcrumbsEl).toContainElement(getByText(ROOT_NAME))
  expect(breadcrumbsEl).toContainElement(getByText('folder'))
  expect(breadcrumbsEl).toContainElement(getByText('subFolder'))
  expect(mainEl).toHaveTextContent('THIS IS FILE: fileb.txt')

  fireEvent.click(getByText('folder'))
  await waitForLoading()
  fireEvent.click(getByText('filea.txt'))
  await waitForLoading()

  // 'filea.txt' file
  expect(breadcrumbsEl).toContainElement(getByText(ROOT_NAME))
  expect(breadcrumbsEl).toContainElement(getByText('folder'))
  expect(mainEl).toHaveTextContent('THIS IS FILE: filea.txt')
})
