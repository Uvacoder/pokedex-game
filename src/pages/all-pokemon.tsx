import React, { useState, useMemo } from 'react';
import { NextPage, GetStaticProps } from 'next';
import {
  InputGroup,
  SimpleGrid,
  InputLeftElement,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import Layout from '@components/layout';
import { getPokemons } from '@libs/pokeapi/db';
import { Pokemon } from '@data-types/pokemon.type';
import PokemonItem from '@components/pokemon-item';
import useCollection from '@hooks/useCollection';
import { useAuth } from '@hooks/useAuth';
import DataLoader from '@components/data-loader';

const generatePokemonToFetch = (): number[] =>
  Array.from(
    { length: process.env.NODE_ENV === 'development' ? 10 : 151 },
    (_, index) => index + 1
  );

export const getStaticProps: GetStaticProps<PokemonsPageProps> = async () => {
  const pokemonsToFetch = generatePokemonToFetch();
  const pokemons = await getPokemons(pokemonsToFetch);
  return {
    props: {
      pokemons,
    },
  };
};

type PokemonsPageProps = {
  pokemons: Pokemon[];
};

const PokemonsPage: NextPage<PokemonsPageProps> = ({ pokemons }) => {
  const bg = useColorModeValue('white', 'gray.800');

  const [search, setSearch] = useState<string>('');

  const { user } = useAuth();
  const { data: pokedex } = useCollection<Pokemon>(`users/${user?.id}/pokedex`, {
    orderBy: ['apiId', 'asc'],
  });

  const filteredPokemons = useMemo(
    () => pokemons?.filter((pokemon) => pokemon.name.includes(search)),
    [search, pokemons]
  );

  return (
    <Layout>
      <InputGroup mb="6">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search for a pokemon"
          borderWidth="2px"
          bg={bg}
          onChange={(event) => setSearch(event.target.value)}
        />
      </InputGroup>
      {!pokedex ? (
        <DataLoader />
      ) : (
        <SimpleGrid columns={5} spacing={8}>
          {filteredPokemons &&
            filteredPokemons.map((pokemon) => (
              <PokemonItem key={pokemon.apiId} pokemon={pokemon} pokedex={pokedex} />
            ))}
        </SimpleGrid>
      )}
    </Layout>
  );
};

export default PokemonsPage;