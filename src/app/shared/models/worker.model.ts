import { Time } from './time.model';
import { Box } from './box.model';

export class Worker {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Time,
        public boxes: Box[]
    ) { }
}

export class WorkerAdd {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Time,
        public boxes: string[]
    ) { }
}

export class WorkerEdit {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Time,
        public boxes: string[]
    ) { }
}