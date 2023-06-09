import { Injectable } from '@nestjs/common';
import { Amenity } from 'src/amenities/entities/amenity.entity';
import { DatasourceService } from 'src/datasource/datasource.service';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { DoctorsService } from 'src/doctors/doctors.service';
import { CreateAmenityDto } from './dto/AmenityDto';
import { In } from 'typeorm';


@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly doctorsService: DoctorsService
  ) {}




 async create(createAmenity: CreateAmenityDto): Promise<Amenity> {
    const amenity = this.amenityRepository.create();
    amenity.name = createAmenity.name;
    amenity.cost = createAmenity.cost;
    const doctor = await this.doctorsService.findOne(createAmenity.doctorId);
    amenity.doctor = doctor;
    await this.amenityRepository.save(amenity);
    return amenity;
  }

  findOne(id: number): Promise<Amenity> {
    return this.amenityRepository.findOne({
      where: { id },
      relations: { orders: true },
    });
  }

  async findAll(): Promise<Amenity[]> {
    const amenities = await this.amenityRepository.find({
      relations: {
        orders: true,
      },
    });
    return amenities;
  }


  async update(id: number, updateAmenity: CreateAmenityDto) {
    const amenity = await this.amenityRepository.findOne({ where: { id } });
    amenity.name = updateAmenity.name;
    amenity.cost = updateAmenity.cost;  

    await this.amenityRepository.save(amenity);
    return amenity;
  }


  remove(id: number) {
    this.amenityRepository.delete({ id });
  }
}


