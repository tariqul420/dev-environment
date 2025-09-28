# Oh My Posh prompt
oh-my-posh init fish --config ~/.poshthemes/custom-dev.omp.json | source

if status is-interactive
    # Enhanced ls with lsd (if available)
    if command -q lsd
        alias ls="lsd --group-dirs=first --icon=always --color=always"
        alias ll="lsd -lh --group-dirs=first --icon=always --color=always"
        alias la="lsd -lha --group-dirs=first --icon=always --color=always"
    else
        alias ll="ls -lh --color=auto"
        alias la="ls -lha --color=auto"
    end

    # Git shortcuts
    alias gs="git status"
    alias ga="git add ."
    alias gc="git commit -m"
    alias gp="git push"
    alias gl="git pull"
    alias gd="git diff"
    alias gb="git branch"
    alias gco="git checkout"

    # Enhanced utilities
    if command -q batcat
        alias cat="batcat --style=plain --paging=never"
    else if command -q bat
        alias cat="bat --style=plain --paging=never"
    end
    
    # Navigation shortcuts
    alias cls="clear"
    alias ..="cd .."
    alias ...="cd ../.."
    alias ....="cd ../../.."
    
    # Development shortcuts
    alias c="code ."
    alias npmls="npm list --depth=0"
    alias npmg="npm list -g --depth=0"
end
