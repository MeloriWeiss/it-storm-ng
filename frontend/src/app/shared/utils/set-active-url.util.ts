import configNavigationUrls from "../../config/configNavigationUrls";

export class SetActiveUrlUtil {
  static setUrl(url: string): string {
    if (url.indexOf(configNavigationUrls.services) > -1) {
      return configNavigationUrls.services;
    }
    if (url.indexOf(configNavigationUrls.about) > -1) {
      return configNavigationUrls.about;
    }
    if (url.indexOf(configNavigationUrls.blog) > -1) {
      return configNavigationUrls.blog;
    }
    if (url.indexOf(configNavigationUrls.reviews) > -1) {
      return configNavigationUrls.reviews;
    }
    if (url.indexOf(configNavigationUrls.contacts) > -1) {
      return configNavigationUrls.contacts;
    }
    return '';
  }
}
