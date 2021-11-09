// import { Borsh } from '@metaplex/utils';
// import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@solana/web3.js';
// import { Transaction } from '../../../Transaction';
// import { MetadataDataData } from '../accounts/Metadata';
// import { MetadataProgram } from '../MetadataProgram';

import { programs, actions, utils } from "@metaplex/js";
import { TransactionInstruction } from "@solana/web3.js";

export class UpdateMetadataArgs extends utils.Borsh.Data<{
  data?: programs.metadata.MetadataDataData;
  updateAuthority?: string;
  primarySaleHappened: boolean | null;
}> {
  static readonly SCHEMA:any = new Map([
    ...programs.metadata.MetadataDataData.SCHEMA,
    // @ts-ignore
    ...this.struct([
      ['instruction', 'u8'],
      ['data', { kind: 'option', type: programs.metadata.MetadataDataData }],
      ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
      ['primarySaleHappened', { kind: 'option', type: 'u8' }],
    ]),
  ]);

  instruction = 1;
  // data: MetadataDataData | null = null;
  updateAuthority: string | null = null;
  primarySaleHappened?: boolean | null;
}

export class UpdateMetadata extends programs.Transaction {
  constructor(options: any, params: any) {
    super(options);
    const { metadata, metadataData, updateAuthority, newUpdateAuthority, primarySaleHappened } =
      params;

    const data = UpdateMetadataArgs.serialize({
      data: metadataData,
      updateAuthority: newUpdateAuthority && newUpdateAuthority.toString(),
      primarySaleHappened: primarySaleHappened || null,
    });

    console.log('final data is ', data);

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: metadata,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: updateAuthority,
            isSigner: true,
            isWritable: false,
          },
        ],
        programId: programs.metadata.MetadataProgram.PUBKEY,
        data,
      }),
    );
  }
}
