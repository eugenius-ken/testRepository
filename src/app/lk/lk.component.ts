import { Component } from '@angular/core';

import { BoxService } from '../shared/services/box.service';
import { ClassService } from '../shared/services/class.service';
import { CarService } from '../shared/services/car.service';
import { ServiceService } from '../shared/services/service.service';
import { WorkerService } from '../shared/services/worker.service';
import { ClientService } from '../shared/services/client.service';
import { OrderService } from '../shared/services/order.service';
import { ArchiveOrderService } from '../shared/services/archive-order.service';

@Component({
    selector: 'lk-page',
    templateUrl: './lk.component.html',
    styleUrls: ['./lk.component.css']
})
export class LkComponent {
    constructor(
        private boxService: BoxService,
        private classService: ClassService,
        private carService: CarService,
        private serviceService: ServiceService,
        private workerService: WorkerService,
        private clientService: ClientService,
        private orderService: OrderService,
        private archiveOrderService: ArchiveOrderService
    ) { }
}