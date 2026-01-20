import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'kyc-test-upload-file',
  isDefault: true,
   access: (allow) => ({
    'public/*': [
        allow.guest.to(['read', 'write']),
        allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'admin/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.authenticated.to(['read'])
    ],
    'private/{entity_id}/*': [
        allow.entity('identity').to(['read', 'write', 'delete'])
    ]
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



