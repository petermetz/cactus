#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");

const TAG = path.basename(__filename);

const main = async () => {
  const hasFilterArg = process.argv.length >= 5;

  if (process.argv.length < 4) {
    console.error(process.argv);
    throw new Error(
      `Invalid input provided: ` +
        `Need input directory and output directory as CLI arguments.` +
        `Example: ${TAG} ./src/main/solidity/ ./src/main/resources/`,
    );
  }


  const inputDir = process.argv[2];
  const inputDirExists = await fs.pathExists(inputDir);
  const inputDirAbs = path.isAbsolute(inputDir);
  const outputDir = process.argv[3];
  const outputDirExists = await fs.pathExists(outputDir);
  const filterGlob = hasFilterArg ? process.argv[4] : "**";

  if (!inputDirExists) {
    throw new Error(`${TAG} inputDir does not exist at: ${inputDir}`);
  }
  if (!outputDirExists) {
    throw new Error(`${TAG} outputDir does not exist at: ${outputDir}`);
  }

  const cwd = inputDirAbs ? inputDir : path.join(process.cwd(), inputDir);
  console.log(`${TAG} inputDirAbs: ${inputDirAbs}`);
  console.log(`${TAG} fast-glob cwd: ${cwd}`);
  const stream = fg.stream(filterGlob, {
    cwd,
    dot: true,
    ignore: [],
  });

  for await (const entry of stream) {
    console.log(`${TAG} Entry=${entry}`);
    const entryFilePath = path.join(inputDir, entry);
    const fileContents = await fs.readFile(entryFilePath, "utf-8");
    const fileAsBase64 = Buffer.from(fileContents).toString("base64");
    const warpperObject = {
      filepath: path.parse(entryFilePath),
      filename: path.basename(entryFilePath),
      base64: fileAsBase64,
    };
    const wrapperJson = JSON.stringify(warpperObject, null, 4);

    let outFilePath;
    if (!path.isAbsolute(outputDir)) {
      outFilePath = path.join(process.cwd(), outputDir, `${entry}.json`);
    } else {
      outFilePath = path.join(outputDir, entry, ".json");
    }

    const outFileDir = path.dirname(outFilePath);
    console.log(`${TAG} mkdir -p OutFileDir=${outFileDir}`);
    await fs.mkdirp(outFileDir);

    console.log(`${TAG} OutFilePath=${outFilePath}`);
    await fs.writeFile(outFilePath, wrapperJson, { encoding: "utf8" });
  }
};

main()
  .then(() => {
    console.error(`${TAG} execution OK.`);
    process.exit(0);
  })
  .catch((ex) => {
    console.error(`${TAG} crashed: `, ex);
    process.exit(-1);
  });
