import React, { FormEvent, HTMLAttributes, useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { TitleText } from '~/components/TitleText';
import { DeleteModal } from '~/components/DeleteModal';
import { EditModal } from '~/components/EditModal';
import { createGift, getAllGifts } from '~/utils/apiRequests';
import { Gift, PatchAnniversary, User } from '~/shared/types';
import { handleError } from '~/utils/handleError';
import { InferGetServerSidePropsType } from 'next';
import SvgUser from '~/icons/user';
import SvgArrowRightStartOnRectangle from '~/icons/arrow_right_start_on_rectangle';
import { getServerSideProps } from '~/utils/getServerSideProps';
import SvgPencilEdit from '~/icons/pencil_edit';
import SvgTrashCan from '~/icons/trash_can';
import axios from 'axios';
import { handleErrorToast } from '~/utils/handleToasts';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import SvgSpinner from '~/icons/spinner';
import { Input } from '~/components/Input';

export { getServerSideProps };

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [date, setDate] = useState<Date>(new Date());
  const [anniversaryName, setAnniversaryName] = useState('asd');
  const [personUUID, setPersonUUID] = useState(
    '620fc3e9-0cf3-493f-9a5a-53fe2970aa7b',
  );
  const [anniversaryUUID, setAnniversaryUUID] = useState('1asd');

  useEffect(() => {
    async function runThis() {
      try {
        const oldData = await (
          await axios.get(`/api/persons/${personUUID}`)
        ).data;
        console.log(oldData);
      } catch (e) {
        console.error(e);
      }
    }
    void runThis();
  }, []);

  return (
    <main className="h-screen w-full max-w-full">
      <div className="mt-5 flex max-w-72 flex-col justify-self-center">
        <label htmlFor="personUUID">Person UUID:</label>
        <Input
          name="personUUID"
          className="mb-10"
          onChange={(e) => setPersonUUID(e.currentTarget.value)}
        />
        <form
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              console.log(e);
              console.log(date);
              console.log(anniversaryName);
              console.log(personUUID);
              const patchObject: PatchAnniversary = {
                action: 'create',
                date: date,
                name: anniversaryName,
                uuid: anniversaryUUID,
              };
              await axios.patch(`/api/persons/${personUUID}`, {
                anniversary: patchObject,
              });
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <label htmlFor="anniversaryName">Nimi:</label>
          <Input
            name="anniversaryName"
            onChange={(e) => setAnniversaryName(e.currentTarget.value)}
          />
          <label htmlFor="date">Päivämäärä:</label>
          <input
            name="date"
            type="date"
            className="mt-5"
            onChange={(e) => setDate(new Date(e.target.value))}
          />
          <Button type="submit">Click</Button>
        </form>
      </div>
    </main>
  );
}
