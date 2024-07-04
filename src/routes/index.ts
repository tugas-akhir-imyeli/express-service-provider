import express, { request } from "express";
import axios from "axios";
import dotenv from "dotenv";
import {createHash} from "crypto";

export var router = express.Router();

dotenv.config();
/* GET home page. */
router.get("/", async function (req, res, next) {
  try{
    const codeVerifier = process.env.CODE_VERIFIER;
    const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
    const requestUrl = `${process.env.OIDC_URL}/oidc/auth?client_id=${process.env.CLIENT_ID}&response_type=code&response_mode=query&redirect_uri=http://localhost:${process.env.SERVER_PORT}/callback&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid is_legal_age`
    res.render("login", { title: "Login", requestUrl: requestUrl, port: process.env.SERVER_PORT, oidcUrl: process.env.OIDC_URL, clientId: process.env.CLIENT_ID, codeChallenge: codeChallenge});
  } catch(error:any){
    console.error(error.message);
    res.send({ message: "Internal Server Error", error: error }).status(500);
  }
});

router.post("/decode-jwt", async function (req, res, next) {
  try{
    const jwt = req.body.jwt;
    const decoded = jwt.split(".")[1];
    const buff = Buffer.from(decoded, "base64");
    const decodedString = buff.toString("utf-8");
    res.send(decodedString).status(200);
  } catch(error:any){
    console.error(error.message);
    res.send({ message: "Internal Server Error", error: error }).status(500);
  }
});

router.get("/callback", async function (req, res, next) {
  try{
    console.log(req.query);
    console.log(req.body)
    res.send(req.query).status(200);
  } catch(error:any){
    console.error(error.message);
    res.send({ message: "Internal Server Error", error: error }).status(500);
  }
});