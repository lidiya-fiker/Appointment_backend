import 'dotenv/config'; // this loads .env variables globally
import { Approval } from 'src/approvals/approvals.entity';
import { CheckInOut } from 'src/checkinout/checkinout.entity';
import { Customer } from 'src/customers/customer.entity';
import { IntegritySetting } from 'src/integrity/integriry.entity';
import { Notification } from 'src/notifications/notification.entity';
import { Request } from 'src/requests/request.entity';
import { Permission } from 'src/roles/permission.entity';

import { Role } from 'src/roles/role.entity';
import { User } from 'src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production', // optional: consider false in production
  logging: true,
  entities: [
    User,
    Request,
    Customer,
    Approval,
    IntegritySetting,
    Notification,
    CheckInOut,
    Role,
    Permission,
  ],
  subscribers: [],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
