// src/auth/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role?.permissions) {
      throw new ForbiddenException(
        `You need permission: ${requiredPermission}`,
      );
    }

    // Handle both object and string permissions
    const userPermissions = user.role.permissions.map((p: any) =>
      typeof p === 'string' ? p : p.key,
    );

    // 🔹 Define implicit permission mapping
    const implicitPermissions: Record<string, string[]> = {
      approve_request: [
        'approve_request',
        'reject_request',
        'reassign_request',
      ],
    };

    // Expand allowed permissions if grouped
    const allowedPermissions = implicitPermissions[requiredPermission] || [
      requiredPermission,
    ];

    const hasPermission = allowedPermissions.some((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You need permission: ${requiredPermission}`,
      );
    }

    return true;
  }
}
