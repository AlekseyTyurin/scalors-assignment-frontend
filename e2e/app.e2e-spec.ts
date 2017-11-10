import { ScalorsAssignmentFrontendPage } from './app.po';

describe('scalors-assignment-frontend App', () => {
  let page: ScalorsAssignmentFrontendPage;

  beforeEach(() => {
    page = new ScalorsAssignmentFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
