You need mongodb running first. Config file: backend/src/app/mongo.ts

To modify server settings open backend/src/app/server.ts
Server port is specified in backend/src/index.ts file
If you change server settings, then also modify
frontend/src/shared/services/socketService.ts accordingly.

Contract is currencly uploaded to telos evm testnet for simplicity, in the
future doing "npm run dev" in the contracts folder will run the local node and
compile & upload contracts for full local development.

Do "npm install" in the root directory first, then do "npm run build" in the
shared directory, and finally do "npm run dev" in both frontend and backend
directories.

In the future, doing "npm run dev" in the root folder will do all of the above
without the need to run these servers individually, but no time to cleanup this.

Goto: http://localhost:5173/
