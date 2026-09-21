/**
 * 宠物快照与朋友解析。不碰存储。
 * 所属模块：labs/pet-journal
 */
import type { Friend, Pet } from "./types.ts";

export function emptyPet(): Pet {
  return {
    id: crypto.randomUUID(),
    name: "",
    species: "cat",
    traits: [],
    photos: [],
    friends: [],
    createdAt: Date.now(),
  };
}

export function resolveFriend(
  owner: Pet,
  friendId: string | undefined,
  pets: Pet[],
): { friend: Friend; photos: string[]; species?: Pet["species"] } | undefined {
  if (!friendId) return undefined;
  const friend = owner.friends.find((item) => item.id === friendId);
  if (!friend) return undefined;
  if (friend.kind === "pet" && friend.petId) {
    const other = pets.find((item) => item.id === friend.petId);
    return {
      friend: { ...friend, name: other?.name ?? friend.name, species: other?.species ?? friend.species },
      photos: other?.photos ?? (friend.photo ? [friend.photo] : []),
      species: other?.species ?? friend.species,
    };
  }
  return {
    friend,
    photos: friend.photo ? [friend.photo] : [],
    species: friend.species,
  };
}

export function petSnapshot(pet: Pet) {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    age: pet.age,
    traits: pet.traits,
    hobbies: pet.hobbies,
    toys: pet.toys,
    food: pet.food,
    catchphrase: pet.catchphrase,
    photos: pet.photos,
  };
}
