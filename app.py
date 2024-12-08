from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rookling_hunters.db'

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    kills = db.relationship('Kill', backref='hunter', lazy=True)

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    members = db.relationship('User', backref='team', lazy=True)

class Kill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    teams = Team.query.all()
    return render_template('index.html', teams=teams)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        team_id = request.form['team']
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('register'))
            
        user = User(username=username,
                    password_hash=generate_password_hash(password),
                    team_id=team_id)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    
    teams = Team.query.all()
    return render_template('register.html', teams=teams)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password_hash, request.form['password']):
            login_user(user)
            return redirect(url_for('index'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/record', methods=['GET', 'POST'])
@login_required
def record():
    if request.method == 'POST':
        kill = Kill(count=int(request.form['count']),
                   description=request.form['description'],
                   user_id=current_user.id,
                   timestamp=datetime.utcnow())
        db.session.add(kill)
        db.session.commit()
        flash('Kills recorded successfully!')
        return redirect(url_for('index'))
    return render_template('record.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create teams if they don't exist
        team_names = ['North Hunters', 'South Seekers', 'East Raiders', 'West Warriors']
        for name in team_names:
            if not Team.query.filter_by(name=name).first():
                db.session.add(Team(name=name))
        db.session.commit()
    app.run(debug=True)