import 'dotenv/config'; // this loads .env variables globally
import { Approval } from 'src/approvals/approvals.entity';
import { CheckInOut } from 'src/checkinout/checkinout.entity';
import { Customer } from 'src/customers/customer.entity';
import { IntegritySetting } from 'src/integrity/integriry.entity';
import { Notification } from 'src/notifications/notification.entity';
import { Request } from 'src/requests/request.entity';
import { User } from 'src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'kidiya',
  database: 'appointment',
  synchronize: true,
  logging: true,
  entities: [
    User,
    Request,
    Customer,
    Approval,
    IntegritySetting,
    Notification,
    CheckInOut,
  ],
  subscribers: [],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
