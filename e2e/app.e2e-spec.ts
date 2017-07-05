import { MoykaFrontendPage } from './app.po';

describe('moyka-frontend App', () => {
  let page: MoykaFrontendPage;

  beforeEach(() => {
    page = new MoykaFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
