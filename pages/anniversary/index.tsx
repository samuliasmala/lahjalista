import React, { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { PatchAnniversary } from '~/shared/types';
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from '~/utils/getServerSideProps';
import axios from 'axios';
import { Input } from '~/components/Input';
import { errorWrapper } from '~/utils/utilFunctions';

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

  function handleSubmit() {
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
    console.log(patchObject);
    /*
    await axios.patch(`/api/persons/${personUUID}`, {
      anniversary: patchObject,
    });
    */
  }

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
          onSubmit={(e) => {
            e.preventDefault();
            errorWrapper(async () => {
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
              console.log(patchObject);
              /*
              await axios.patch(`/api/persons/${personUUID}`, {
                anniversary: patchObject,
              });
              */
            });
            return;
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
