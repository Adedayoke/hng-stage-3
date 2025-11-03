import axios from "axios";
const COIN_GECKO_API_URL = "https://api.coingecko.com/api/v3";

interface PriceResponse {
  [coin: string]: { usd: number; usd_24h_change: number };
}
interface CoinDetailsResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
  };
}
interface RiskAssessmentResponse {
  riskLevel: string;
  volatility: number;
  recommendation: string;
  reasoning: string;
}
export async function fetchCurrentPrice(coin: string): Promise<PriceResponse> {
  try {
    const response = await axios.get(
      `${COIN_GECKO_API_URL}/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`
    );
    const data = response.data;
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(`Failed to fetch price for ${coin}`);
  }
}
export async function fetchCoinDetails(
  coin: string
): Promise<CoinDetailsResponse> {
  try {
    const response = await axios.get(`${COIN_GECKO_API_URL}/coins/${coin}`);
    const data = response.data;
    const dataExtracted: CoinDetailsResponse = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      market_data: {
        current_price: {
          usd: data.market_data.current_price.usd,
        },
        market_cap: {
          usd: data.market_data.market_cap.usd,
        },
        total_volume: {
          usd: data.market_data.total_volume.usd,
        },
        high_24h: {
          usd: data.market_data.high_24h.usd,
        },
        low_24h: {
          usd: data.market_data.low_24h.usd,
        },
        price_change_percentage_24h:
          data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data.price_change_percentage_7d,
        price_change_percentage_30d:
          data.market_data.price_change_percentage_30d,
        circulating_supply: data.market_data.circulating_supply,
        total_supply: data.market_data.total_supply,
        ath: {
          usd: data.market_data.ath.usd,
        },
        atl: {
          usd: data.market_data.atl.usd,
        },
      },
    };
    return dataExtracted;
  } catch (err) {
    console.log(err);
    throw new Error(`Failed to fetch details for ${coin}`);
  }
}
export async function assessCryptoRisk(
  coin: string
): Promise<RiskAssessmentResponse> {
  try {
    const coinPrice = await fetchCurrentPrice(coin);
    if (
      coinPrice[coin].usd_24h_change < 2 &&
      coinPrice[coin].usd_24h_change > -2
    ) {
      return {
        riskLevel: "Low Risk",
        recommendation: "HOLD or BUY",
        reasoning: "Price is stable with low volatility",
        volatility: coinPrice[coin].usd_24h_change,
      };
    } else if (
      coinPrice[coin].usd_24h_change < 5 &&
      coinPrice[coin].usd_24h_change > -5
    ) {
      return {
        riskLevel: "Medium Risk",
        recommendation: "HOLD",
        reasoning: "Moderate volatility, watch closely",
        volatility: coinPrice[coin].usd_24h_change,
      };
    } else if (
      coinPrice[coin].usd_24h_change > 5 ||
      coinPrice[coin].usd_24h_change < -5
    ) {
      return {
        riskLevel: "HIGH Risk",
        recommendation: "CAUTION",
        reasoning: "High volatility, risky for new positions",
        volatility: coinPrice[coin].usd_24h_change,
      };
    } else {
      return {
        riskLevel: "Unknown",
        recommendation: "DATA UNAVAILABLE",
        reasoning: "Unable to determine risk due to missing price data",
        volatility: 0,
      };
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Failed to fetch details for ${coin}`);
  }
}
