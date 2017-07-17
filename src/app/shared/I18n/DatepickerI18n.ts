import { Component, Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DatePickerI18n extends NgbDatepickerI18n {
    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES['ru'].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES['ru'].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
}

const I18N_VALUES = {
  ru: {
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      months: ['Янв', 'Фев', 'Мрт', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Нбр', 'Дек']
  }
};

