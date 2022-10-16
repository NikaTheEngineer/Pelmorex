import '@testing-library/jest-dom/extend-expect';

import { screen } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';

import Header from '../components/Header/Header';

describe('Header component tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.createRoot(container).render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
    });
  });

  afterAll(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('renders correctly', async () => {
    const links = await screen.findAllByRole('link');

    expect(links).toHaveLength(3);
  });

  it('renders the correct links', async () => {
    const links = await screen.findAllByRole('link');

    expect(links[0]).toHaveTextContent('Zoo Animals');
    expect(links[1]).toHaveTextContent('List');
    expect(links[2]).toHaveTextContent('About');
  });

  it('renders the correct links hrefs', async () => {
    const links = await screen.findAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/list');
    expect(links[1]).toHaveAttribute('href', '/list');
    expect(links[2]).toHaveAttribute('href', '/about');
  });
});
