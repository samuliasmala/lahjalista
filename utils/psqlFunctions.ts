import { DatabaseError } from 'pg';

export function handle3D000(e: DatabaseError) {
  //console.log('handling error: 3D000', e);
  console.log(e.message.toLocaleUpperCase);
}

export function handle42P01(e: DatabaseError) {
  console.log('handling error: 42P01', e);
}
