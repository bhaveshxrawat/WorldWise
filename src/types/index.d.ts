type City = {
  cityName: string;
  country: string;
  emoji: string;
  date: string | Date;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
};

type Country = {
  country: string;
  emoji: string;
  id: string;
};
