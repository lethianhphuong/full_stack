import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_PEOPLE } from '@/sections/demo-project/person/constants';
import type { PersonFormValues, PersonRecord } from '@/sections/demo-project/person/types';

type PersonState = { people: PersonRecord[] };
type PersonActions = {
  addPerson: (values: PersonFormValues) => string;
  updatePerson: (id: string, values: PersonFormValues) => void;
  removePerson: (id: string) => void;
  resetPeople: () => void;
};

export const useDemoPersonStore = create<PersonState & PersonActions>()(persist((set) => ({
  people: INITIAL_PEOPLE,
  addPerson: (values) => {
    const id = crypto.randomUUID();
    set((state) => ({ people: [{ ...values, id, createdAt: new Date().toISOString() }, ...state.people] }));
    return id;
  },
  updatePerson: (id, values) => set((state) => ({ people: state.people.map((person) => person.id === id ? { ...values, id, createdAt: person.createdAt } : person) })),
  removePerson: (id) => set((state) => ({ people: state.people.filter((person) => person.id !== id) })),
  resetPeople: () => set({ people: INITIAL_PEOPLE }),
}), { name: 'demo-project-people-v3', partialize: (state) => ({ people: state.people }) }));

export const selectDemoPeople = (state: PersonState & PersonActions) => state.people;
export const selectAddDemoPerson = (state: PersonState & PersonActions) => state.addPerson;
export const selectUpdateDemoPerson = (state: PersonState & PersonActions) => state.updatePerson;
export const selectRemoveDemoPerson = (state: PersonState & PersonActions) => state.removePerson;
export const selectResetDemoPeople = (state: PersonState & PersonActions) => state.resetPeople;

