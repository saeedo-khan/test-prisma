import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("app running...");
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
      username,
    },
  });
  res.status(201).json({
    type: "success",
    message: `Account created for ${user.username}`,
    data: {
      user,
    },
  });
  try {
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
      }
    }
    throw error;
  }
});

app.get("/api/users", async (req: Request, res: Response) =>{
    try {
        const users = await prisma.user.findMany({
            include: {
                writtenPosts: true
            }
        });

        res.status(201).json({
            type: "success",
            message: `fetched users`,
            data: {
              users,
            },
          });
        
    } catch (error) {
        console.log(error);
    }
})

async function main() {
  const user = await prisma.user.findMany({
    include: {
      writtenPosts: true,
    },
  });
  console.dir(user);
}

main()
  .catch((e) => {
    console.log(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
