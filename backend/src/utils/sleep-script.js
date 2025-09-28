const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("Ожидаем поднятие БД...");
  await sleep(3000);
}

main();
