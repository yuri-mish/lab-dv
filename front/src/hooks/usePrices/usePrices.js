import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useCallback, useState } from 'react';

const getPrices = loader('./getPrices.gql');

export const usePrices = (mainPriceType, onError) => {
  const [ data, setData ] = useState();
  const [ loading, setLoading ] = useState(false);
  const gqlClient = useApolloClient();

  const loadPrices = useCallback(async (
    date, useAddPrice = false, priceType = null,
  ) => {
    setLoading(true);
    const res = await gqlClient.query({
      query: getPrices,
      variables: { date, useAddPrice, priceType: priceType ?? mainPriceType },
    })
      .then((res) => {
        const prices = res.data.prices;
        setData(prices);
        return prices;
      })
      .catch(() => onError?.());
    setLoading(false);

    return res;
  }, [ mainPriceType ]);

  const prices = data;

  const findPrice = (prices, ref) => prices?.find(
    (priceInfo) => priceInfo.nom === ref,
  )?.price;

  const getPrice = (ref) => findPrice(prices, ref);

  return {
    loadPrices,
    findPrice, // Find price in a price list (async update)
    getPrice, // Get price from the prices state
    loading,
    prices,
  };
};
