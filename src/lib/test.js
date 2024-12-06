export function calcularMM1(v_lambda, v_mu) {
    const v_rho = v_lambda / v_mu;
    const v_po = 1 - v_rho;
    const v_ls = v_rho / (1 - v_rho);
    const v_lq = Math.pow(v_rho, 2) / (1 - v_rho);
    const v_ws = v_ls / v_lambda;
    const v_wq = v_lq / v_lambda;

    let n = 0;
    let v_pn_temp = 1;
    let fn_acumulado = 0;
    const resultados = [];

    // Calcular n y almacenar los resultados
    while (v_pn_temp > 0) {
        v_pn_temp = parseFloat((v_po * Math.pow(v_rho, n)).toFixed(4));
        if (v_pn_temp > 0) {
            fn_acumulado += v_pn_temp;
            resultados.push({
                n,
                Pn: v_pn_temp,
                Fn: parseFloat(fn_acumulado.toFixed(4)),
            });
            n++;
        }
    }

    return resultados;
};

export function calcularMMK(v_lambda, v_mu, v_k) {
    let n = 0;
    let v_pn_temp = 1;
    let fn_acumulado = 0;

    // Calculo de rho
    const v_rho = v_lambda / v_mu;

    // Calculo de Po
    let v_po;
    if (v_rho === 1) {
        v_po = 1 / (v_k + 1);
    } else {
        v_po = (1 - v_rho) / (1 - Math.pow(v_rho, v_k + 1));
    }

    // Calculo de Pn
    const resultados = [];
    while (n <= v_k) {
        // Cálculo de Pn
        v_pn_temp = parseFloat((Math.pow(v_rho, n) * v_po).toFixed(4));

        // Acumulamos Fn
        fn_acumulado += v_pn_temp;

        // Guardamos los resultados
        resultados.push({
            n,
            Pn: v_pn_temp,
            Fn: parseFloat(fn_acumulado.toFixed(4)),
        });

        // Incrementamos n
        n++;
    }

    return resultados;
};

export function factorial(n) {
    n === 0 ? 1 : n * factorial(n - 1)
}

export function calcularMMS(v_lambda, v_mu, v_c) {
    let n = 0;
    let v_pn_temp = 1;
    let fn_acumulado = 0;

    const v_rho = v_lambda / v_mu;

    // Calcular P0
    const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
        (acc, n) => acc + Math.pow(v_lambda / v_mu, n) / factorial(n),
        0
    );

    const v_po =
        1 /
        (sumatoria +
            (Math.pow(v_lambda / v_mu, v_c) /
                (factorial(v_c) * (1 - v_rho / v_c))));

    const resultados = [];

    // Calcular n y almacenar los resultados
    while (v_pn_temp > 0) {
        if (0 <= n && n <= v_c) {
            v_pn_temp = parseFloat(
                (
                    (Math.pow(v_lambda / v_mu, n) / factorial(n)) *
                    v_po
                ).toFixed(4)
            );
        } else {
            v_pn_temp = parseFloat(
                (
                    (Math.pow(v_lambda / v_mu, n) /
                        (factorial(v_c) * Math.pow(v_c, n - v_c))) *
                    v_po
                ).toFixed(4)
            );
        }

        if (v_pn_temp > 0) {
            fn_acumulado += v_pn_temp;
            resultados.push({
                n,
                Pn: v_pn_temp,
                Fn: parseFloat(fn_acumulado.toFixed(4)),
            });
            n++;
        }
    }

    return resultados;
};

export function calcularMMSK (v_lambda, v_mu, v_c, v_k) {
    let n = 0;
    let v_pn_temp = 1;
    let fn_acumulado = 0;

    const v_rho = v_lambda / v_mu;
    const v_rc = v_rho / v_c;

    // Calcular Po
    let v_po;
    if (v_rc === 1) {
        const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
            (acc, n) => acc + Math.pow(v_rc, n) / factorial(n),
            0
        );
        v_po =
            1 /
            (sumatoria +
                (Math.pow(v_rho, v_c) / factorial(v_c)) * (v_k - v_c + 1));
    } else {
        const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
            (acc, n) => acc + Math.pow(v_rho, n) / factorial(n),
            0
        );
        v_po =
            1 /
            (sumatoria +
                (Math.pow(v_rho, v_c) *
                    (1 - Math.pow(v_rc, v_k - v_c + 1))) /
                (factorial(v_c) * (1 - v_rc)));
    }

    const resultados = [];

    // Calcular Pn y Fn
    while (n <= v_k) {
        if (0 <= n && n <= v_c) {
            v_pn_temp = parseFloat(
                (
                    (Math.pow(v_rho, n) / factorial(n)) *
                    v_po
                ).toFixed(4)
            );
        } else if (v_c <= n && n <= v_k) {
            v_pn_temp = parseFloat(
                (
                    (Math.pow(v_rho, n) /
                        (factorial(v_c) * Math.pow(v_c, n - v_c))) *
                    v_po
                ).toFixed(4)
            );
        }

        fn_acumulado += v_pn_temp;

        resultados.push({
            n,
            Pn: v_pn_temp,
            Fn: parseFloat(fn_acumulado.toFixed(4)),
        });

        n++;
    }

    return resultados;
};