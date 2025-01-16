import { Injectable } from '@angular/core';
import {ApplicationServiceValuesType} from "../../../types/application-service-values.type";
import {ApplicationServiceType} from "../../../types/application-service.type";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  getApplicationServices(): ApplicationServiceType[] {
    return [
      {
        title: 'Создание сайтов',
        value: ApplicationServiceValuesType.websiteCreation,
        description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
        price: '7 500'
      },
      {
        title: 'Продвижение',
        value: ApplicationServiceValuesType.promotion,
        description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
        price: '3 500'
      },
      {
        title: 'Реклама',
        value: ApplicationServiceValuesType.advertisement,
        description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
        price: '1 000'
      },
      {
        title: 'Копирайтинг',
        value: ApplicationServiceValuesType.copywriting,
        description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
        price: '750'
      },
    ]
  }
}
