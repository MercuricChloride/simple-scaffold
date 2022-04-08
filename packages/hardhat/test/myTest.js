const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("YourContract");

      myContract = await YourContract.deploy(4804776778, "0x807a1752402D21400D555e1CD7f175566088b955");
    });

    describe("write()", function () {

      it("Should be able to mint a token", async function () {
        const [addr1] = await ethers.getSigners()
        await myContract.write(0, 1, { value: ethers.utils.parseEther("0.001") });
        expect(await myContract.ownerOfPixel(0)).to.equal(addr1.address);
      });

      it("Should overwrite an existing token", async function () {
        const [addr1, addr2] = await ethers.getSigners()
        await myContract.connect(addr2).write(0, 1, { value: ethers.utils.parseEther("0.001") });
        expect(await myContract.ownerOfPixel(0)).to.equal(addr2.address);
      });

      it("Should emit a Pixel event ", async function () {
        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
        expect(await myContract.connect(addr4).write(2, 2, { value: ethers.utils.parseEther("0.001") }))
          .to.emit(myContract, "Pixel")
          .withArgs(2, 2);
      });

      it("Should revert if fee too low", async function () {
        const [addr1, addr2, addr3] = await ethers.getSigners();

        await expect(myContract.connect(addr3).write(1, 1)).to.be.revertedWith("fee too low")
      });

      it("Should revert if placement too fast", async function () {
        const [addr1, addr2, addr3] = await ethers.getSigners();
        await expect(myContract.connect(addr1).write(1, 1)).to.be.revertedWith("Must wait at least 5 minutes before placing another pixel");
      });

      it("Should revert if the game is over", async function () {
        await network.provider.send("evm_setNextBlockTimestamp", [4804776778]);
        await network.provider.send("evm_mine");
        await expect(myContract.write(69,10,{value: ethers.utils.parseEther("0.001")})).to.be.revertedWith("Game is finished");
      });
    });

    // describe("setPurpose()", function () {
    //   it("Should be able to mint a token", async function () {
    //     const newPurpose = "Test Purpose";

    //     await myContract.setPurpose(newPurpose);
    //     expect(await myContract.purpose()).to.equal(newPurpose);
    //   });

    //   it("Should emit a SetPurpose event ", async function () {
    //     const [owner] = await ethers.getSigners();

    //     const newPurpose = "Another Test Purpose";

    //     expect(await myContract.setPurpose(newPurpose))
    //       .to.emit(myContract, "SetPurpose")
    //       .withArgs(owner.address, newPurpose);
    //   });
    // });
  });
});
