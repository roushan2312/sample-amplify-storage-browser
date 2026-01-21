import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'replica-test-1vp-s3',
//   existing: true,
  isDefault: true,
  access: (allow) => ({
    // 'invoices/*': [
    //     allow.guest.to(['read', 'write']),
    //     allow.authenticated.to(['read', 'write', 'delete']),
    // ],
    'invoices/*': [
        allow.groups(['1vp-ops']).to(['read', 'write']),
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.authenticated.to(['read', 'write', 'delete']),
    ]
    // 'private/{entity_id}/*': [
    //     allow.entity('identity').to(['read', 'write', 'delete'])
    // ]
   })
});

// export const secondaryStorage = defineStorage({
//   name: 'junk-update-file',
//    access: (allow) => ({
//     'backup_public/*': [
//         allow.guest.to(['read', 'write']),
//         allow.authenticated.to(['read', 'write', 'delete']),
//     ],
//     'backup_admin/*': [
//         allow.groups(['admin']).to(['read', 'write', 'delete']),
//         allow.authenticated.to(['read'])
//     ],
//     'backup_private/{entity_id}/*': [
//         allow.entity('identity').to(['read', 'write', 'delete'])
//     ]
//    })
// });



