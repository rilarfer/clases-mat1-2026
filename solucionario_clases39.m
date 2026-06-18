% Script de Verificación para el Sistemático de Matemática I
% Requiere: Symbolic Math Toolbox
clear; clc;
syms k i n x y;

%% Pregunta 1: Sumas, Riemann y Propiedades
disp('--- P1: Sumas y Definidas ---');
disp(['1a: ', char(symsum(3*k - 2, k, 1, 20))]);
disp(['1b: ', char(symsum(i^2 - 4*i + 1, i, 1, 15))]);
disp('1c: int(x^3, x, 1, 4)');
disp('1d: int(2/(1+x^2), x, 0, 2)');
disp(['1e: ', char(int(2*x + 1, x, 0, 3))]);
disp(['1f: ', char(int(x^2 - x, x, 1, 4))]);
disp('1g: 13 (Propiedad aditiva)');
disp('1h: -10 (Inversión de límites)');
disp('1i: 38 (Linealidad)');
disp('1j: 0 (Límites iguales)');

%% Pregunta 2: Cambio de Variable Básico y Definidas
disp('--- P2: Cambio de Variable ---');
disp(['2a: ', char(int(x^3/(x^2 + 1), x, -3, 3))]);
disp(['2b: ', char(int(x^4*sin(x) + x^2, x, -pi, pi))]);
disp(['2c: ', char(int(2*x*(x^2 + 1)^3, x, 0, 2))]);
disp(['2d: ', char(int(x/(x^2 - 4)^2, x, 0, 1))]);
disp(['2e: ', char(int(sin(x)^3*cos(x), x, 0, pi/2))]);
disp(['2f: ', char(int(x^2*sqrt(1 - x^3), x, 0, 1))]);
disp(['2g: ', char(int(log(x)/x, x, 1, exp(1)))]);
disp(['2h: ', char(int(x*cos(x^2), x, 0, sqrt(pi)))]);
disp(['2i: ', char(int(exp(sqrt(x))/sqrt(x), x, 1, 4))]);
disp(['2j: ', char(int(exp(x)/(1 + exp(2*x)), x, 0, 1))]);

%% Pregunta 3: Cambio de Variable Especial
disp('--- P3: u = a + b - x ---');
disp(['3a: ', char(int(tan(x)*sec(x)^2, x, pi/6, pi/3))]);
disp(['3b: ', char(int(x/sqrt(x + 1), x, 0, 3))]);
disp(['3c: ', char(int(sin(x)/(sin(x) + cos(x)), x, 0, pi/2))]);
disp(['3d: ', char(int(sqrt(cos(x))/(sqrt(sin(x)) + sqrt(cos(x))), x, 0, pi/2))]);
disp(['3e: ', char(int(sqrt(x)/(sqrt(x) + sqrt(4 - x)), x, 1, 3))]);
disp(['3f: ', char(int(x*sin(x)/(1 + cos(x)^2), x, 0, pi))]);
disp(['3g: ', char(int(log(9 - x)/(log(9 - x) + log(x + 3)), x, 2, 4))]);
disp(['3h: ', char(int(cos(x)/(sin(x) + cos(x)), x, 0, pi/2))]);
disp(['3i: ', char(int(x*sqrt(2 - x), x, 0, 2))]);
disp(['3j: ', char(int(x*sin(x), x, 0, pi))]);

%% Pregunta 4: Áreas Simples y Geométricas
disp('--- P4: Áreas Simples ---');
disp(['4a: ', char(int(sqrt(4 - x^2), x, -2, 2))]);
disp(['4b: ', char(int(4 - x, x, 0, 3))]);
disp(['4c: ', char(int(abs(x), x, -1, 2))]);
disp(['4d: ', char(int(sqrt(16 - x^2), x, 0, 4))]);
disp(['4e: ', char(int(x + 3, x, -3, 0))]);
disp(['4f: ', char(int(x^2, x, 1, 3))]);
disp(['4g: ', char(int(sqrt(x), x, 0, 4))]);
disp(['4h: ', char(int(2*x - x^2, x, 0, 2))]);
disp(['4i: ', char(int(x - x^3, x, 0, 1))]);
disp(['4j: ', char(int(4 - y^2, y, -2, 2))]);

%% Pregunta 5: Áreas Compuestas
disp('--- P5: Áreas Compuestas ---');
disp(['5a: ', char(int(2*y - y^2, y, 0, 2))]);
disp(['5b: ', char(int(exp(x) - exp(-x), x, 0, 1))]);
disp(['5c: ', char(int(1/x, x, 1, exp(1)))]);
disp(['5d: ', char(abs(int(x^3 - x, x, -1, 0)) + abs(int(x^3 - x, x, 0, 1)) + abs(int(x^3 - x, x, 1, 2)))]);
disp(['5e: ', char(int(cos(x) - sin(x), x, 0, pi/4) + int(sin(x) - cos(x), x, pi/4, pi))]);
disp(['5f: ', char(int((y + 2) - y^2, y, 0, 2))]);
disp(['5g: ', char(int((2 - x^2) - abs(x), x, -1, 1))]);
disp(['5h: ', char(int(2*x, x, 0, 1) + int(4 - 2*x, x, 1, 2))]);
disp(['5i: ', char(int(3*y - (y^3 - y), y, 0, 2) + int((y^3 - y) - 3*y, y, -2, 0))]);
disp(['5j: ', char(abs(int(x^2 - 4, x, -2, 2)))]);
