import {Router, Request, Response} from 'express';
import {v4 as random} from 'uuid'
import {User} from '../entity/User'
import { AppDataSource } from '../data-source'
import bcrypt, { genSalt } from 'bcryptjs'
import { initialize } from '../data-source'
import {StatusCodes} from 'http-status-codes'
import { error } from 'console';
import { send } from 'process';



const router = Router();
const crud = AppDataSource.getRepository(User);

router.get(
    '/users', async (req: Request, res: Response) => {

        try{
            const user: User[] = await crud.manager.find(User);
            res.json(user);
        }
        catch(err){
            console.error(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
        
        }
    }
);

router.post(
    '/register', async (req: Request, res: Response)=> {
        
            const {email, password, title, firstname, lastname, role} = req.body;

            const userExists = await crud.manager.findOneBy(User, {email: email});
            if(userExists){
                res.status(StatusCodes.BAD_REQUEST).json("User already registered!");
                return;
            }
            try {
                //hashpassword use bcrypt gensalt
                const salt = await bcrypt.genSalt(10);
                const hashpassword = await bcrypt.hash(password,salt);

                //random ID
                let id = random()

                const newUser = new User();

                newUser.id = id;
                newUser.email = email;
                newUser.password = hashpassword;
                newUser.title = title;
                newUser.firstname = firstname;
                newUser.lastname = lastname;
                newUser.role = role;

                await crud.manager.save(newUser);
                res.json(newUser);
            }

            catch(err){
                console.error(`error hashing password ` , err);
                return;
            }
    }
);


router.post(
    '/login', async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const user = await crud.manager.findBy(User, {email: email})
        const verifyPassword = await bcrypt.compare(password, user[0].password)

        if(!user || !verifyPassword){
            res.status(StatusCodes.BAD_REQUEST).josn({msg: `NO user found`})
        }
        else{
            console.log(`User logged in`);
            res.status(StatusCodes.OK).json({msg: `User logged in`});

        }
    }

)

router.get(
    '/users/:id', async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const user = await crud.manager.findOneBy(User, {id: id});
            if(user){
                res.json(user);
            }
            else{
                res.status(StatusCodes.BAD_GATEWAY).send(error);
            }


        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    
        }
    }
)

//UPDATE
router.put(
    '/users/:id', async (req: Request, res: Response) => {
        try{
            const {id} = req.params;
            const {email, password, title, firstname, lastname, role} = req.body;
            const user = await crud.manager.findOneBy(User, {id: id});
            const upUser = new User();

            if(user){
                const newpassword = await bcrypt.compare(password, user.password);
                
                if(newpassword){
                    await bcrypt.hash(password, 10);
                    upUser.password = password;
                }
                if(role)
                    upUser.role = role;

                if(title)
                    upUser.title = title;
            }
            await crud.manager.update(User, {id: id}, upUser);
                res.json(user);
        }
        catch(err){
            console.error(err);
        }
        
    }
)

router.delete(
    '/users/:id', async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const {email, password} = req.body;


            const user = await crud.manager.findOneBy(User, {id: id});
            if(!user){
                res.status(StatusCodes.NOT_FOUND).send({message: `User not found `});
            }
            else{
                const verifyPassword = await bcrypt.compare(password, user.password);
                if(verifyPassword){
                    await crud.manager.delete(User, {id: id});
                    res.status(StatusCodes.OK).send({message: `User{${id}} deleted `});
                }
                res.status(StatusCodes.BAD_REQUEST).send({message: `Wrong password `});
            }
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
        }
    }
)

export default router;

