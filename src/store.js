import { atom } from "jotai";

export const countAtom = atom(0);
export const logedUser = atom(null);
export const deviceToken = atom(null);
export const userFriendRequests = atom([])
export const userNewRequests = atom([])