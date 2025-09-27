"use server";

import { OrderStatus } from "@prisma/client";
import { cache } from "react";
import logger from "../logger";
import { prisma } from "../prisma";
import { requiredUser, userId } from "../utils/auth";

export async function getCustomerOrders() {
