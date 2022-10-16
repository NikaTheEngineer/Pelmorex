import '@testing-library/jest-dom/extend-expect';

import { screen } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from '../App';
import store from '../store';

describe('Routing tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.createRoot(container).render(
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      );
    });
  });

  afterAll(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('redirects to /list when the user navigates to /', async () => {
    await screen.findAllByRole('banner');

    expect(window.location.pathname).toBe('/list');
  });

  it('redirects to the correct page when the user clicks the logo or the menu items', async () => {
    const links = await screen.findAllByRole('link');

    act(() => {
      links[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/list');

    act(() => {
      links[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/about');

    act(() => {
      links[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/list');
  });
});
