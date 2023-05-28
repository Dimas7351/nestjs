import { Inject, Injectable } from '@nestjs/common';
import { Order } from 'src/orders/entities/order.entity';
import { DatasourceService } from 'src/datasource/datasource.service';
import { HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PatientsService } from 'src/patients/patients.service';
import { AmenitiesService } from 'src/amenities/amenities.service';
import { Repository } from 'typeorm';
import { DoctorsService } from 'src/doctors/doctors.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
    constructor(private readonly datasourceService: DatasourceService,
        private readonly patientsService: PatientsService,
        private readonly amenitiesService: AmenitiesService,
        private readonly doctorsService: DoctorsService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository <Order>) {}

    async create(orderDto: CreateOrderDto): Promise<Order> {
       // this.datasourceService.getOrders().push(order); //считываем patient и ameninty
        //return order;
        const order = this.orderRepository.create();
        const { patientId, amenityId, doctorId } = orderDto;

        // Получить данные пациента и услуги по их ID
        const patient = await this.patientsService.findOne(patientId);
        const amenity = await this.amenitiesService.findOne(amenityId);
        const doctor = await this.doctorsService.findOne(doctorId);
    
        // Создать экземпляр заказа с использованием полученных данных
        order.patientName = patient.fullname;
        order.amenityName = amenity.name;
        order.doctorName = doctor.fullname;
        order.price = amenity.cost;
    
        // Сохранить заказ в базе данных
        await this.orderRepository.save(order);
        return order;
    
    
    }

    findOne(id: number) {
        return this.datasourceService
            .getOrders()
            .find((order) => order.id === id);
        }
    
    findAll(): Order[] {
        return this.datasourceService.getOrders();
        }

    update(id: number, updatedOrder: Order) {
        const index = this.datasourceService
            .getOrders()
            .findIndex((order) => order.id === id);
        this.datasourceService.getOrders()[index] = updatedOrder;
        return this.datasourceService.getOrders()[index];
        }

    remove(id: number) {
        const index = this.datasourceService
            .getOrders()
            .findIndex((order) => order.id === id);
        this.datasourceService.getOrders().splice(index, 1);
        return HttpStatus.OK;
        }

}