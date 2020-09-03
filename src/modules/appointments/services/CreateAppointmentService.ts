// Responsável pela criação do agendamento
import { startOfHour } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * [x] Recebimento das informações
 * [/] Tratativas de erros/excessões
 * [x] Acesso ao Repositório
 */

interface IRequest {
  provider_id: string;
  date: Date;
}

/**
 * Dependency Inversion (SOLID)
 */

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // Verificação de agendamento
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Se teve o mesmo horário
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
