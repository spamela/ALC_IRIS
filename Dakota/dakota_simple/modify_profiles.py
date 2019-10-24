#!/usr/bin/python


"""

Private program to fit jorek profiles to HRTS data before ELMs, and get flux contour from EFIT

"""



# -------------------------------------------------
# Import all modules
# -------------------------------------------------
try:
  import sys
  import sys,traceback
  import numpy
  import pylab
  from scipy import optimize
  from math import pi, sin, cos, sqrt, exp, atan2, tanh, cosh
  import matplotlib.pyplot as plt
  import matplotlib
except:
  print "-------failed to import module!---------"
  traceback.print_exc(file=sys.stdout)
  sys.exit(127)


def curve(x, a):
    poly  = 1.0 + a[2]*x + a[3]*x*x + a[4]*x*x*x
    atanh = 0.5 - 0.5*tanh((x-a[6])/a[5])
    return (a[0]-a[1]) * poly * atanh + a[1]


# -------------------------------------------------
# Main function
# -------------------------------------------------
def main():
    
    # --- Get arguments options
    plot_all = True
    plot_ne  = True
    plot_Te  = True
    if (len(sys.argv) > 1):
      if ( (sys.argv[1] == '-h') or (sys.argv[1] == '--help') ):
        print('Script usage:')
        print('  >> ./modify_profiles.py [options]')
        print('Available options:')
        print('  -d | --density        >> plot density	 profile only')
        print('  -t | --temperature    >> plot temperature profile only')
        print('  -a | --all (default)  >> plot all profiles')
      if ( (sys.argv[1] == '-d') or (sys.argv[1] == '--density'    ) ):
        plot_all = False
        plot_ne  = True
        plot_Te  = False
      if ( (sys.argv[1] == '-t') or (sys.argv[1] == '--temperature') ):
        plot_all = False
        plot_ne  = False
        plot_Te  = True
      if ( (sys.argv[1] == '-a') or (sys.argv[1] == '--all'        ) ):
        plot_all = True
        plot_ne  = True
        plot_Te  = True
    else:
        print('note: use option -h for help')
    
    matplotlib.rcParams.update({'font.size': 24})
    matplotlib.rcParams.update({'font.weight': 'bold'})
    matplotlib.rcParams.update({'legend.fontsize': 18})
        
    # prof 1
    d1 = numpy.zeros(10)
    t1 = numpy.zeros(10)
    central_density = 1.57e+20
    d1[0] = 1.0      ;   t1[0] = 0.4266
    d1[1] = 0.03     ;   t1[1] = 0.0062
    d1[2] = -0.44    ;   t1[2] = -0.747898
    d1[3] = -0.885   ;   t1[3] = -0.0851739
    d1[4] = 0.673    ;   t1[4] = 0.216169
    d1[5] = 0.08     ;   t1[5] = 0.0577426
    d1[6] = 0.96     ;   t1[6] = 0.947335

    # prof 2
    d2 = numpy.zeros(10)
    t2 = numpy.zeros(10)
    central_density2 = 1.57e+20
    d2[0] = 1.0       ;   t2[0] = 0.4266
    d2[1] = 0.03      ;   t2[1] = 0.0062
    d2[2] = -0.44     ;   t2[2] = -0.747898
    d2[3] = -0.885    ;   t2[3] = -0.0851739
    d2[4] = 0.673     ;   t2[4] = 0.216169
    d2[5] = 0.02      ;   t2[5] = 0.02
    d2[6] = 0.99      ;   t2[6] = 0.985
    
    # --- Normalisations
    mu_0            = 1.2566370614e-6
    eV2Joules       = 1.6e-19 
    rho_norm        = central_density  * 3.32e-27
    rho_norm2       = central_density2 * 3.32e-27
    t_norm          = sqrt(mu_0*rho_norm )
    t_norm2         = sqrt(mu_0*rho_norm2)
    TT_norm         = 1.0 / (mu_0*central_density )
    TT_norm2        = 1.0 / (mu_0*central_density2)
    
    # --- Get profiles along psi based on JOREK coefficients
    npsi = 300
    psi_large = numpy.linspace(0.0, 1.2, npsi)
    D1  = numpy.array([]) ;  T1  = numpy.array([]) ;  P1  = numpy.array([])
    D2  = numpy.array([]) ;  T2  = numpy.array([]) ;  P2  = numpy.array([])
    for i in range (0,npsi):
      D1 = numpy.append(D1,curve(psi_large[i],d1))
      D2 = numpy.append(D2,curve(psi_large[i],d2))
      T1 = numpy.append(T1,curve(psi_large[i],t1))
      T2 = numpy.append(T2,curve(psi_large[i],t2))
      P1 = numpy.append(P1,curve(psi_large[i],d1)*curve(psi_large[i],t1))
      P2 = numpy.append(P2,curve(psi_large[i],d2)*curve(psi_large[i],t2))
    
    # --- Get pressure gradient
    dP1 = numpy.zeros(npsi)
    dP2 = numpy.zeros(npsi)
    for i in range(1,npsi):
      dP1[i] = -(P1[i]-P1[i-1])/(psi_large[i]-psi_large[i-1])
      dP2[i] = -(P2[i]-P2[i-1])/(psi_large[i]-psi_large[i-1])
    
    # --- Plot density
    if (plot_ne):
      fig = plt.figure()
      ax1 = fig.add_subplot(111)
      ax1.plot(psi_large,D1 * central_density ,'b', linewidth=2)
      ax1.plot(psi_large,D2 * central_density2,'r', linewidth=2)
      pylab.xlabel('psi (normalised)')
      pylab.ylabel('ne [$m^{-3}$]')
      pylab.title('Density')
      pylab.xlim([0.0,1.2])
      ax1.legend(['old','new'])
    
    # --- Plot temperature
    if (plot_Te):
      fig = plt.figure()
      ax1 = fig.add_subplot(111)
      ax1.plot(psi_large,T1* TT_norm /eV2Joules/2.0 ,'b', linewidth=2)
      ax1.plot(psi_large,T2* TT_norm2/eV2Joules/2.0 ,'r', linewidth=2)
      pylab.xlabel('psi (normalised)')
      pylab.ylabel('Te [eV]')
      pylab.title('Temperature')
      ax1.legend(['old','new'])
      
    # --- Plot pressure gradient
    if (plot_all):
      fig = plt.figure()
      ax1 = fig.add_subplot(111)
      ax1.plot(psi_large,dP1/max(max(dP1),max(dP2)) ,'b', linewidth=2)
      ax1.plot(psi_large,dP2/max(max(dP1),max(dP2)) ,'r', linewidth=2)
      pylab.xlabel('psi (normalised)')
      pylab.ylabel('dP [au]')
      pylab.title('Pressure Gradient')
      pylab.xlim([0.7,1.1])
      pylab.ylim([0.0,1.2])
      ax1.legend(['old','new'])
    
    # --- Plot density and temperature together
    if (plot_all):
      fig = plt.figure()
      ax1 = fig.add_subplot(111)
      ax1.plot(psi_large,D1/D1[0]     ,'k', linewidth=2)
      ax1.plot(psi_large,T1/T1[0]*4.0 ,'r', linewidth=2)
      ax1.plot(psi_large,D2/D2[0]     ,'k--', linewidth=2)
      ax1.plot(psi_large,T2/T2[0]*4.0 ,'r--', linewidth=2)
      pylab.xlabel('psi (normalised)')
      pylab.ylabel('Te [au]')
      pylab.title('Both')
      pylab.xlim([0.7,1.1])
      pylab.ylim([0.0,1.2])
      ax1.legend(['old ne','old Te','new ne','new Te'])
    
    # --- Print result
    print(" rho_0       = %f" % d2[0])
    print(" rho_1       = %f" % d2[1])
    print(" rho_coef(1) = %f" % d2[2])
    print(" rho_coef(2) = %f" % d2[3])
    print(" rho_coef(3) = %f" % d2[4])
    print(" rho_coef(4) = %f" % d2[5])
    print(" rho_coef(5) = %f" % d2[6])
    print(" ")
    print(" T_0         = %f" % t2[0])
    print(" T_1         = %f" % t2[1])
    print(" T_coef(1)   = %f" % t2[2])
    print(" T_coef(2)   = %f" % t2[3])
    print(" T_coef(3)   = %f" % t2[4])
    print(" T_coef(4)   = %f" % t2[5])
    print(" T_coef(5)   = %f" % t2[6])
    
    pylab.show()
    return






##################################################################
################### Execution Routine ############################
##################################################################
if __name__ == "__main__":
    """Main program"""
    try:
      main()
    except:
      print "-------unhandled exception!---------"
      traceback.print_exc(file=sys.stdout)
      sys.exit(127)
