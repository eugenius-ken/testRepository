import { Box } from './box.model';

export class Worker {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Date,
        public boxes: Box[]
    ) { }
}

export class WorkerAdd {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Date,
        public boxes: string[]
    ) { }
}

export class WorkerEdit {
    constructor(
        public id: string,
        public name: string,
        public job: string,
        public startDate: Date,
        public boxes: string[]
    ) { }
}