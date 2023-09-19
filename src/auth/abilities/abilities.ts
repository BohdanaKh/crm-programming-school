import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { orders, User } from '@prisma/client';

export type AppAbility = PureAbility<
  [
    string,
    (
      | 'all'
      | Subjects<{
          user: User;
          Orders: orders;
        }>
    ),
  ],
  PrismaQuery
>;

let ANONYMOUS_ABILITY: AppAbility;
export function defineAbilityFor(user?: User) {
  if (user) return createPrismaAbility(defineRulesFor(user));

  ANONYMOUS_ABILITY =
    ANONYMOUS_ABILITY || createPrismaAbility(defineRulesFor());
  return ANONYMOUS_ABILITY;
}

export function defineRulesFor(user?: User) {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
  switch (user?.role) {
    case 'admin':
      defineAdminRules(builder);
      break;
    case 'manager':
      defineManagerRules(builder, user);
      break;
  }

  return builder.rules;
}

function defineAdminRules({ can }: AbilityBuilder<AppAbility>) {
  can('manage', 'all');
  can(['create', 'read', 'update', 'delete'], 'User');
}

function defineManagerRules({ can }: AbilityBuilder<AppAbility>, user: User) {
  can(['read', 'create', 'delete', 'update'], ['Orders'], {
    manager: user.id,
  });
  // can(['read', 'update'], 'User', { id: user.id });
}
