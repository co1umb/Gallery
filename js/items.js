export const isDemo = true;
 
 let items = [
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 55,
    endTime: "2023-12-31T10:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 60,
    endTime: "2023-12-31T11:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 20,
    endTime: "2023-12-31T12:00:00+00:00",
  },
  {
    rimaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 0,
    endTime: "2023-12-31T13:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 4,
    endTime: "2023-12-31T14:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 0,
    endTime: "2023-12-31T15:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 99,
    endTime: "2023-12-31T16:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 0,
    endTime: "2023-12-31T17:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 12,
    endTime: "2023-12-31T18:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 6,
    endTime: "2023-12-31T19:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 3,
    endTime: "2023-12-31T20:00:00+00:00",
  },
  {
    primaryImage: "",
    title: "",
    subtitle: "",
    detail: "",
    secondaryImage: "",
    amount: 7,
    endTime: "2023-12-31T21:00:00+00:00",
  },
];

// Заповнення даних
async function generateRandomItemData(items) {
  await $.getJSON(
    "https://random-data-api.com/api/name/random_name",
    { size: items.length },
    (data) => {
      data.forEach((elem, i) => {
        items[i].title ||= elem.name;
      });
    }
  );
  await $.getJSON(
    "https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum",
    { size: items.length },
    (data) => {
      data.forEach((elem, i) => {
        items[i].subtitle ||= elem.short_sentence;
        items[i].detail ||= elem.very_long_sentence;
      });
    }
  );
  for (let i = 0; i < items.length; i++) {
    items[i].primaryImage ||= "https://picsum.photos/200/300?random=" + i;
    items[i].secondaryImage ||= "https://picsum.photos/200/300?random=" + i;
  }
  return items;
}

export async function getItems() {
  items = isDemo ? await generateRandomItemData(items) : items;
  // Ідентифікатори лотів
  items.forEach((item, idx) => (item.id = idx));
  // Формат часу
  items.forEach((item) => (item.endTime = new Date(item.endTime)));
  // Сортування лотів по часу
  items.sort((a, b) => a["endTime"] - b["endTime"]);
  return items;
}
