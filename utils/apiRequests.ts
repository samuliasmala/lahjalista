import axios from 'axios';
import { CreateGift, CreateUser, Gift, QueryKeys, User } from '~/shared/types';
import { useQuery } from '@tanstack/react-query';

const giftsBaseUrl = '/api/gifts';

/**
 *
 * @returns an array that contains all the gifts as objects
 */
export function useGetGifts() {
  return useQuery({
    queryKey: QueryKeys.GIFTS,
    queryFn: async () => {
      return (await axios.get(giftsBaseUrl)).data as Gift[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}

/**
 *
 * @param uuid should be given a string that contains the id that is wanted to be searched.
 * @returns an object of a gift if it was found. Else it will return null
 */
export async function getGift(uuid: string) {
  return (await axios.get(`${giftsBaseUrl}/${uuid}`)).data as Gift;
}

/**
 *
 * @param newObject a new object of a gift with type Gift that will added to the server
 */
export async function createGift(newObject: CreateGift) {
  return (await axios.post(`${giftsBaseUrl}`, newObject)).data as Gift;
}

/**
 *
 * @param uuid should be given a string that contains the id of the gift that is wanted to be updated
 * @param newObject should be given parts of Gift object type that are wanted to be updated
 */
export async function updateGift(uuid: string, newObject: Partial<Gift>) {
  return (await axios.patch(`${giftsBaseUrl}/${uuid}`, newObject)).data as Gift;
}

/**
 *
 * @param uuid should be given the id of the gift that is wanted to be deleted
 */
export async function deleteGift(uuid: string) {
  await axios.delete(`${giftsBaseUrl}/${uuid}`);
  return;
}

// USER REQUESTS!

const usersBaseUrl = '/api/users';

export async function getAllUsers() {
  return (await axios.get(usersBaseUrl)).data as User[];
}

export async function getUser(uuid: string) {
  return (await axios.get(`${usersBaseUrl}/${uuid}`)).data as User;
}

export async function createUser(newObject: CreateUser) {
  return (await axios.post(`${usersBaseUrl}`, newObject)).data as User;
}

export async function updateUser(uuid: string, newObject: Partial<User>) {
  return (await axios.patch(`${usersBaseUrl}/${uuid}`, newObject)).data as User;
}

export async function deleteUser(uuid: string) {
  await axios.delete(`${usersBaseUrl}/${uuid}`);
  return;
}
