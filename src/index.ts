import * as express from 'express';
import * as hbs from 'hbs';
import * as fs from 'fs';

import { Application, Response, Request, Express } from 'express'

export class Main {

  private _app: Express;
  private _maintenanceInProgress = false;
  private _port = process.env.PORT || 3000;

  constructor() {
    this._app = express();
    hbs.registerPartials(__dirname + '/../views/partials')
    this._app.set('view engine', 'hbs');
    this._app.use(express.static(__dirname + '/../public'))

    hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
    hbs.registerHelper('getPageName', () => 'Awesome Website');
    hbs.registerHelper('capitalize', (text: string) => text.toUpperCase());

    this._app.use((req, res, next) => {
      const now = new Date().toString();
      const log = `${now}: ${req.method} ${req.path}`
      fs.appendFile('server.log', log + '\n', error => {
        if (error) {
          console.log('Unable to write log');
        }
      });
      next();
    });

    this._app.use((req, res, next) => {
      if (this._maintenanceInProgress) {
        res.render('maintenance.hbs');
      } else {
        next();
      }
    })

    // console.log(this._app);  
    this._app.get('/', (req: Request, res: Response) => {
      res.render('home.hbs', {
        pageTitle: 'Home Page',
        message: 'Welcome home!'
      })
    });

    this._app.get('/about', (req, res) => {
      res.render('about.hbs', {
        pageTitle: 'About Page',
      })
    });

    this._app.get('/projects', (req, res) => {
      res.render('projects.hbs', {
        pageTitle: 'Projects Page',
      })
    });

    this._app.get('/bad', (req, res) => {
      res.send({
        status: false,
        error: {
          message: {
            code: '1.2.3',
            msg: 'Something went wrong'
          }
        }
      })
    });

    this._app.listen(this._port, () => {
      console.log(`Server is running on port ${this._port} `);
    });
  }

  

}

new Main();