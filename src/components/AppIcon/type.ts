import figmaUrl from '@assets/img/app_figma.png';
import notionUrl from '@assets/img/app_notion.png';
import pycharmUrl from '@assets/img/app_pycharm.png';

export enum AppType {
  Figma = 'Figma',
  Notion = 'Notion',
  Pycharm = 'Pycharm',
}

export const APP_ICON_URL_MAPPER: { [appName in AppType]: string } = {
  [AppType.Figma]: figmaUrl,
  [AppType.Notion]: notionUrl,
  [AppType.Pycharm]: pycharmUrl,
};
